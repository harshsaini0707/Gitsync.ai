"use client"
import React from 'react'
import { Card } from '~/components/ui/card';
import {useDropzone} from 'react-dropzone'

import { Presentation, Upload, UploadCloud } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {CircularProgressbar , buildStyles} from 'react-circular-progressbar'
import {uploadAudioToCloudinary} from "../../../lib/cloudniary"
import { api } from '~/trpc/react';
import useProject from '~/hooks/use-project';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const MeetingCard = () => {
       const processMeeting = useMutation({
          mutationFn : async(data : {meetingUrl : string , meetingId : string})=>{
              const {meetingUrl  , meetingId } = data;
              const response = await axios.post('/api/process-meeting',{
                  meetingUrl , meetingId 
              })
              return response.data
          },
           onError: (error) => {
            console.error('Error processing meeting:', error);
            toast.error('Failed to process meeting');
        }
      })
  const {project} = useProject();

  const router = useRouter();
    const[isUploading , setIsUploading] =  React.useState(false)
    const uploadMeeting = api.project.uploadMeeting.useMutation();
    const [progress , setProgress] = React.useState(0);
    const {getRootProps , getInputProps} = useDropzone({
      accept:{
        'audio/*':['.mp3' , '.wav' , '.m4a']
      },
      multiple:false,
      maxSize:50000000,
      onDrop: async acceptedFiles => {
  if (!project) return;
  if (!acceptedFiles[0]) return;

  setIsUploading(true);
  try {
    const downloadUrl = await uploadAudioToCloudinary(
      acceptedFiles[0] as File,
      setProgress
    );

    uploadMeeting.mutate(
      {
        projectId: project.id,
        meetingUrl: downloadUrl,
        name: acceptedFiles[0].name,
      },
      {
        onSuccess: async (meeting) => {
          toast.success("Meeting Uploaded Successfully");
          router.push("/meetings");

          try {
            await processMeeting.mutateAsync({
              meetingUrl: downloadUrl,
              meetingId: meeting.id,
            });
          } catch (err) {
            console.error("Meeting processing failed:", err);
            toast.error("Processing failed after upload.");
          }
        },
        onError: () => {
          toast.error("Failed to upload audio");
        },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Audio upload failed. Please try again.");
  } finally {
    setIsUploading(false);
  }
},


    })
   return (
    <Card
      className="col-span-2 flex flex-col items-center justify-center px-6 py-12 gap-1 border-dashed border-2 border-gray-300 hover:border-blue-300 transition-all duration-300 text-center"
      {...getRootProps()}
    >
      {!isUploading ? (
        <>
          <Presentation className="h-12 w-12 text-blue-600 animate-bounce" />
          <h3 className="text-base font-semibold text-gray-800">
            Create a New Meeting
          </h3>
          <p className="text-sm text-gray-500">
            Analyze your meeting with <span className="font-medium">Gitsync</span>
            <br />
            <span className="text-xs">Powered by AI</span>
          </p>

          <div>
            <Button
              disabled={isUploading}
              className="mt-2 flex items-center gap-2"
            >
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            className="w-20 h-20"
            styles={buildStyles({
              pathColor: "#2563eb",
              textColor: "#2563eb",
            })}
          />
          <p className="text-sm text-gray-600">Uploading your meeting...</p>
        </div>
      )}
    </Card>
  );
};
export default MeetingCard