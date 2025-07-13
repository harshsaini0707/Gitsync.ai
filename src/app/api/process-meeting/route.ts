import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import {z} from 'zod'
import { processMeeting } from "~/lib/assembly";
import { db } from "~/server/db";

const bodyparser = z.object({
    meetingUrl : z.string(),
    meetingId : z.string()
})

 // as deploy on vercel  by default this function timeout after 10sec that we con't want to

 export const maxDuration = 300 //5min



export async function POST(req : NextRequest){
    const {userId}  =  await auth()
    if(!userId){
        return NextResponse.json({
            error:"Unauthorized"
        },{
            status : 401
        })
    }
    try {
        
        const body = await req.json();
        const { meetingUrl, meetingId } = body;

        const {summarises}  =  await processMeeting(meetingUrl);

        await db.issue.createMany({
            data : summarises.map(summary=>({
                start : summary.start,
                end : summary.end,
                gist : summary.gist,
                headline : summary.headline,
                summary : summary.summary,
                meetingId
            }))
        })
        await db.meeting.update({
            where: {id : meetingId } ,
            data:{
                status : "COMPLETED",
                name : summarises[0]?.headline
            }
        })
        return NextResponse.json({message :'Successfull' , status : 200})

 
    } catch (error) {
        console.log(error);
        
       return NextResponse.json({
            error:"Internal Server Error"
        },{
            status : 500
        })  
    }
}
