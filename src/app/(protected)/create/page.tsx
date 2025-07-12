"use client"
import { Plus } from 'lucide-react'
import React from 'react'
import {useForm} from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { api } from '~/trpc/react'
import useRefetch from "../../../hooks/use-refetch"

type FormInput = {
    repoUrl : string ,
    projectname : string,
    githubToken?: string
}
const CreatePage = () => {
    const {register , handleSubmit , reset} = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation() // give mutatuoion to call the backed function -> root.ts
    const refetch = useRefetch()
    function onSubmit(data : FormInput){
      //  window.alert(JSON.stringify(data , null , 2))
        createProject.mutate({
          githubUrl: data.repoUrl,
          name : data.projectname,
          githubToken : data.githubToken
        },{
            onSuccess : ()=>{
                toast.success('Project created successfully')
                refetch();
            },
            onError : ()=>{
                toast.success('Failed to create Project')
                reset()
            }
        })
       return true 
    }
  return (
    <div className='flex items-center gap-12  h-full justify-center'>
      <img src="/gitlogoo.avif" alt='image' className='h-56 opacity-90 w-auto'/> 
      <div>
        <div>
         <h1 className='font-semibold text-2xl'>
            Link Your GitHub Repository 
            </h1>   
            <p className='text-sm text-muted-foreground'>
                Enter the URL of your repository to link it to Gitsync
            </p>
        </div>
        <div className='h-4'></div>
        <div>
    <form onSubmit={handleSubmit(onSubmit)}>
    <Input 
    {...register('projectname' , {required:true}) }
placeholder='Project Name'
required
    />
    <div className='h-4'></div>
     <Input 
    {...register('repoUrl' , {required:true}) }
placeholder='GitHub URL'
type='url'
required
    />
     <div className='h-4'></div>
     <Input 
    {...register('githubToken') }
placeholder='GitHub Token (optinal)'

    />
    <div className='h-4'></div>
    <Button type='submit' disabled={createProject.isPending}>
    <Plus/>    Create Project
    </Button>
    </form>
        </div>
        </div> 
    </div>
  )
}

export default CreatePage