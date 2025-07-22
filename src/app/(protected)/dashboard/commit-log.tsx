"use client"

import clsx from 'clsx'
import React from 'react'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const CommitLog = () => {
    const { selectedProjectId, project } = useProject();
    
    const { data: commits, isLoading } = api.project.getCommits.useQuery({ projectId: selectedProjectId })
    
    console.log(JSON.stringify(commits));

 
    if (isLoading) {
        return (
            <ul className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <li key={i} className="relative flex animate-pulse gap-x-4">
                        <div className="absolute -bottom-6 left-0 top-0 flex w-6 justify-center">
                            <div className="w-0.5 translate-x-1 bg-gray-300"></div>
                        </div>
                        <div className="relative mt-4 size-8 flex-none rounded-full bg-gray-300"></div>
                        <div className="flex-auto rounded-md bg-gray-200 p-3">
                            <div className="h-4 w-2/5 rounded bg-gray-300"></div>
                            <div className="mt-2 h-4 w-4/5 rounded bg-gray-300"></div>
                            <div className="mt-2 h-10 w-full rounded bg-gray-300"></div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }
 
    return (
        <>
            <ul className='space-y-6'>
                {commits?.map((commit, commitIdx) => {
                    return <li key={commit.id} className='relative flex gap-x-4'>
                        <div className={
                            clsx(
                                commitIdx === commits.length - 1 ? 'h-6' : '-bottom-6',
                                'absolute left-0 top-0 flex w-6 justify-center'
                            )
                        }>
                            <div className='w-0.5 translate-x-1 bg-gray-300'></div>
                        </div>
                        <>
                            <img src={commit?.commitAuthorAvatar} alt="commit avatar"
                                className='relative mt-4 size-8 flex-none rounded-full bg-gray-50'
                            />
                            <div className='flex-auto rounded-md bg-gray-200 p-3 ring-inset ring-gray-900'>
                                <div className='flex justify-between gap-x-4'>
                                    <Link target='_blank' href={`${project?.githubUrl}/commits/${commit.commitHash}`}>
                                        <span className='font-medium text-gray-900'>
                                            {commit.commitAuthorName}
                                        </span>{" "}
                                        <span className='inline-flex items-center'>
                                            Commited
                                            <ExternalLink className='ml-1 size-4' />
                                        </span>
                                    </Link>
                                </div>
                                <span className='font-semibold'>
                                    {commit.commitMessage}
                                </span>
                                <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600'>
                                    {commit.summary}
                                </pre>
                            </div>
                        </>
                    </li>
                })}
            </ul>
        </>
    )
}

export default CommitLog