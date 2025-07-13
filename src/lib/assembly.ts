import {AssemblyAI} from "assemblyai";
import dotenv from "dotenv";
dotenv.config();

const client = new AssemblyAI({apiKey : process.env.ASSEMBLY_API_KEY!})

function msToTime(ms : number){
    const sec = ms/1000;
    const min = Math.floor(sec/60)
    const remSec = Math.floor(sec%60)
    return `${min.toString().padStart(2,'0')} :${remSec.toString().padStart(2,'0')}`

}


// export const processMeeting = async (meetingUrl :string)=>{
//     const transcript = await client.transcripts.transcribe({
//         audio: meetingUrl,
//         auto_chapters : true, // automatically classify differnet issue and summarise them 
//     })
//     const summarises = transcript.chapters?.map(chapter =>({
//         start : msToTime(chapter.start),
//         end : msToTime(chapter.end),
//         gist: chapter.gist,
//         headline: chapter.headline,
//         summary:chapter.summary
//     })) || []

//     if(!transcript.text) throw new Error('No transcript')
    
//         return{
//           summarises    
//         }
// }


export const processMeeting = async (meetingUrl: string) => {
  try {
    const transcript = await client.transcripts.transcribe({
      audio: meetingUrl,
      auto_chapters: true,
    });

    if (!transcript.text) {
      throw new Error("No transcript text returned");
    }

    const summarises =
      transcript.chapters?.map((chapter) => ({
        start: msToTime(chapter.start),
        end: msToTime(chapter.end),
        gist: chapter.gist,
        headline: chapter.headline,
        summary: chapter.summary,
      })) || [];
      console.log(summarises);
      

    return { summarises };
  } catch (error) {
    console.error("[PROCESS_MEETING_TRANSCRIBE_ERROR]", error);
    throw error;
  }
};

const FILE_URL = 'https://res.cloudinary.com/dt2z103d6/video/upload/v1752396911/izzfml252anldaqtac86.mp3'
const res= processMeeting(FILE_URL);
console.log(res);
