"use client"
import React from 'react'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react';
import MeetingCard from '../dashboard/meeting-card';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import useRefetch from '~/hooks/use-refetch';


const MeetingsPage = () => {
    const {selectedProjectId} = useProject();

    const refetch =  useRefetch() 
    const {data : meetings , isLoading} = api.project.getMeetings.useQuery({
        projectId : selectedProjectId
    },{
        refetchInterval : 4000 // this function after every 4sec check in backgrounf is meeting done with processing
    })
    const deleteMeeting = api.project.deleteMeeting.useMutation();
  return ( <div>
        <MeetingCard/>
        <div className="h6"></div>
        <div className="text-xl font-semibold">Meetings</div>
        {meetings && meetings.length === 0  && <div>No meetings found</div>}
        {isLoading  && <div>Loading...</div>}
        <ul className='divide-y divide-gray-400'>
    {
        meetings?.map((meeting)=>(
            <li key={meeting.id} className='flex items-center justify-between py-5 gap-x-6'>
                <div>
                <div className='min-w-0'>
                <div className="flex items-center gap-2">
                    <Link  href={`/meetings/${meeting.id}`} className='text-sm font-semibold'>
                    {meeting.name}
                    </Link>
                    {meeting.status === 'PROCESSING' && (
                     <Badge className="bg-yellow-500 text-white flex gap-1">
                          Processing
                        <Loader2 className='animate-spin h-4 w-4 mt-0.5' />
                     
                     </Badge>  
                    )}
                    {meeting.status === 'COMPLETED' && (
                     <Badge className="bg-green-500 text-white">
                       Processed 
                     </Badge>  
                    )}
                </div>
                </div>

<div className='flex items-center text-xs text-gray-500 gap-x-2'>
<p className='whitespace-nowrap'>
    {meeting.createdAt.toLocaleString()}
</p>
<p className='truncate'>{meeting.issues.length} issues</p>

</div>

                </div>

                    <div className='flex items-center flex-none gap-x-4'>
<Link href={`/meetings/${meeting.id}`} >
<Button size='sm' className='outline  bg-white text-black'>
    View Meeting
</Button>
</Link>
               <Button disabled={deleteMeeting.isPending} variant={'destructive'} size={'sm'} 
               onClick={() => deleteMeeting.mutate(
  { meetingId: meeting.id },
  {
    onSuccess: () => {
      toast.success('Meeting Deleted Successfully');
      refetch();
    }
  }
)}

                >
                <Trash2  size={20}  />
                </Button>
               
                    </div>
            </li>
        ))
    }
        </ul>
    </div>
  )
}

export default MeetingsPage