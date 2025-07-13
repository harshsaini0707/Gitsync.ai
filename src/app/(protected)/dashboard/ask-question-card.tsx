"use client"
import React, { useState } from 'react'
import useProject from '../../../hooks/use-project'
import {Card, CardContent, CardHeader, CardTitle} from '../../../components/ui/card'
import {Textarea} from "../../../components/ui/textarea"
import {Button} from "../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader } from '../../../components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import Image from 'next/image'
import { askQuestion } from './action'
import { readStreamableValue } from 'ai/rsc'
import image from "../../../../public/logo.png"
import MDEditor from "@uiw/react-md-editor"
import CodeRef from './code-references'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import useRefetch from '~/hooks/use-refetch'
const AskQuestion = () => {
    const {project} =  useProject();
    const [question , setQuestion] = React.useState('');
    const[open , setOpen] = React.useState(false);
    const[loading , setLoading] = React.useState(false);
    const[fileReferences , setFileReferences] =  React.useState<{fileName : string; sourceCode: string; summary: string}[]>([])
    const[answer , setAnswer] = React.useState('')
    const saveAnswer = api.project.saveAnswer.useMutation();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!project?.id) return;
  setFileReferences([])
  setAnswer('');
  setLoading(true);
  

  try {
    const { output, fileReference } = await askQuestion(question, project.id);
    setOpen(true);
    setFileReferences(fileReference);

    for await (const delta of readStreamableValue(output)) {
      if (delta) setAnswer((ans) => ans + delta);
    }

  } catch (error) {
    console.error('Failed to get answer', error);
  } finally {
    setLoading(false);
  }
};

    console.log(answer);

    const refetch  = useRefetch();
    
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className='sm:max-w-[80vw]'>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              <Image src={image} alt='gitsync' width={40} height={40} /> 
            </DialogTitle>
            <Button 
            disabled={saveAnswer.isPending}
            variant={'outline'} onClick={()=>{
              saveAnswer.mutate({
                projectId : project!.id,
                question,
                answer,
                fileReferences
              },
              {
                onSuccess: ()=>{
                 toast.success('Answer Saved')
                 refetch()
                },
                onError:()=>{
                 toast.error('Failed to save answer!')
                }
              }
            )
            }}>
              Save Answer
            </Button>
          </div>
         <MDEditor.Markdown source= {answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll'/>
         <div className="h-4"></div>
         <CodeRef filesReferences={fileReferences} />
          <Button type='button' onClick={()=>setOpen(false)}>
            Close
          </Button>
    <DialogTitle>
     
    </DialogTitle>
   </DialogHeader>
    </DialogContent>

    </Dialog>
  <Card className='realtive col-span-3'>
    <CardHeader>
        <CardTitle>
            Ask a question
        </CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} >
       <Textarea placeholder="Which file should I edit to change the home page?" value={question} onChange={e => setQuestion(e.target.value)} />
       <div className="h-4"></div>
       <Button type='submit' disabled={loading}>
        Ask to Gitsync
       </Button>
        </form>  
    </CardContent>

  </Card>
    </>
  )
}

export default AskQuestion