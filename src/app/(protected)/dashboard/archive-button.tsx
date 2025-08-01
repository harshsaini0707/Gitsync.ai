'use client'
import React from 'react'
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import useProject from '~/hooks/use-project';
import useRefetch from '~/hooks/use-refetch';
import { api } from '~/trpc/react'

const ArchiveButton = () => {
    const archiveProject =  api.project.archiveProject.useMutation();
    const {selectedProjectId} = useProject();
    const refetch = useRefetch();

  return (
    <Button disabled={archiveProject.isPending} size='sm' variant={'destructive'} onClick={()=>{
        const confirm = window.confirm("Are you sure want to archive this project?")
        if(confirm) archiveProject.mutate({projectId : selectedProjectId},{
         onSuccess:()=>{
            toast.success("Project Archived")
            refetch()
         },
         onError:()=>{
            toast.error("Failed to archive project")
         } 
        })
    }}>
        Archive
    </Button>
  )
}

export default ArchiveButton