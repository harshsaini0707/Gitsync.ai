"use client"
import { Plus, Loader2 } from 'lucide-react' // UPDATED: Imported Loader2 icon
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { api } from '~/trpc/react'
import useRefetch from "../../../hooks/use-refetch"
import { LoaderFive } from '~/components/ui/loader'

type FormInput = {
    repoUrl: string,
    projectname: string,
    githubToken?: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation()
    const refetch = useRefetch()
    
    function onSubmit(data: FormInput) {
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectname,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success('Project created successfully')
                refetch();
            },
            onError: (error) => { // CHANGED: It's better to show an error toast on failure
                toast.error(error.message || 'Failed to create Project')
                reset()
            }
        })
        return true
    }

    return (
        <div className='flex h-full items-center justify-center gap-12'>
            <img src="/gitlogoo.avif" alt='image' className='h-56 w-auto opacity-90' />
            <div>
                <div>
                    <h1 className='text-2xl font-semibold'>
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
                            {...register('projectname', { required: true })}
                            placeholder='Project Name'
                            required
                        />
                        <div className='h-4'></div>
                        <Input
                            {...register('repoUrl', { required: true })}
                            placeholder='GitHub URL'
                            type='url'
                            required
                        />
                        <div className='h-4'></div>
                        <Input
                            {...register('githubToken')}
                            placeholder='GitHub Token (optional)'
                        />
                        <div className='h-4'></div>
                        
                        {/* UPDATED: Button now shows a loading state */}
                        <Button type='submit' disabled={createProject.isPending}>
                            {createProject.isPending ? (
                                <>
                                    <LoaderFive text='Creating...' />
                                 
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Project
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePage