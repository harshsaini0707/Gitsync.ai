import z from "zod";
import { createTRPCRouter ,protectedProcedure } from "../trpc";
import { pollCommits } from "~/lib/github";
import { indexGithubRepo } from "~/lib/github-loader";


import { generateEmbedding } from "~/lib/gemini";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";


export const projectRouter = createTRPCRouter({

 askQuestion: protectedProcedure
    .input(z.object({
      question: z.string(),
      projectId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { question, projectId } = input;

      const queryVector = await generateEmbedding(question);
      const vectorQuery = `[${queryVector.join(',')}]`;

      const result = await ctx.db.$queryRaw`
        SELECT "fileName", "sourceCode", "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
        FROM "SourceCodeEmbedding"
        WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
        AND "projectId" = ${projectId}
        ORDER BY similarity DESC
        LIMIT 10
      ` as { fileName: string; sourceCode: string; summary: string }[];

      let context = ``;
      for (const doc of result) {
        context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`;
      }

      const google = createGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY!,
      });

      const { textStream } = await streamText({
        model: google('gemini-1.5-flash'),
        prompt: `
You are an AI code assistant who answers questions about the codebase...

START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

START QUESTION
${question}
END OF QUESTION

Only answer from the context.
`
      });

      let answer = '';
      for await (const delta of textStream) {
        answer += delta;
      }

      return {
        answer,
        fileReferences: result
      };
    })
  ,createProject : protectedProcedure.input(
    z.object({
        name : z.string(),
        githubUrl : z.string(),
        githubToken : z.string().optional(),
    })
  ).mutation(async({ctx, input})=>{
   const project = await ctx.db.project.create({
  data: {
    githubUrl: input.githubUrl,
    name: input.name,
    UserToProjects: {
      create: {
        userId: ctx.user.userId!,
      },
    },
  },
});
  await indexGithubRepo(project.id, input.githubUrl , input.githubToken)
  await  pollCommits(project.id)
  return project;

    //like express router but trpc allow us to type and typsesafe communication bwtween our frontend and backend
  })  ,
  getProjects  : protectedProcedure.query(async({ctx})=>{
    return await ctx.db.project.findMany({
      where:{
       UserToProjects :{
        some :{
          userId :  ctx.user.userId!
        }
       } ,
       deletedAt: null
      }
    })
  }),
  getCommits : protectedProcedure.input(z.object({
    projectId : z.string()
  })).query(async({ctx , input})=>{
    pollCommits(input.projectId).then().catch(console.error)
    return await ctx.db.commit.findMany({where : {projectId : input.projectId}})
  }),
  saveAnswer:protectedProcedure.input(z.object({
    projectId : z.string(),
    question : z.string(),
    answer : z.string(),
    fileReferences : z.any(),

  })).mutation(async({ctx,input})=>{
    return await ctx.db.question.create({
      data : {
        answer : input.answer,
        fileReference : input.fileReferences,
        projectId : input.projectId,
        question : input.question,
        userId:ctx.user.userId!


      }
    })
  }),
getQuestions: protectedProcedure
  .input(z.object({ projectId: z.string() }))
  .query(async ({ ctx, input }) => {
    return await ctx.db.question.findMany({
      where: {
        projectId: input.projectId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }),

  uploadMeeting : protectedProcedure.input(z.object({
    projectId : z.string(),
    meetingUrl : z.string(),
    name : z.string()
  })).mutation(async ({ctx , input}) =>{
    const meeting = await ctx.db.meeting.create({
      data:{
        meetingUrl : input.meetingUrl,
        projectId : input.projectId,
        name : input.name,
        status : "PROCESSING"
      }
    })
    return meeting
  }),
  getMeetings: protectedProcedure.input(z.object({projectId : z.string()}))
  .query(async({ctx,input})=>{
    return await ctx.db.meeting.findMany({
      where :{
        projectId :input.projectId
      },
      include:{
        issues : true
      }
    })
  }),
  deleteMeeting : protectedProcedure.input(z.object({meetingId : z.string() }))
  .mutation(async ({ctx , input})=>{
    return await ctx.db.meeting.delete({where : {id : input.meetingId}})
  }),
  getMeetingById: protectedProcedure.input(z.object({meetingId : z.string()})).query(async({ctx , input})=>{
    return await ctx.db.meeting.findUnique({where  :{id : input.meetingId} , include :{issues :true}})
  }),
  archiveProject: protectedProcedure
  .input(z.object({ projectId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.project.update({
      where: { id: input.projectId }, 
      data: { deletedAt: new Date() }, 
    });
  }),
  getTeamMembers : protectedProcedure
  .input(z.object({ projectId: z.string() }))
  .query(async ({ ctx, input }) => {
    return await ctx.db.userToProject.findMany({
     where : { projectId : input.projectId},
     include  :{ user : true}
    });
  })
})