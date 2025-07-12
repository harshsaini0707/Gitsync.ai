"use client";
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '~/components/ui/sheet';
import useProject from '~/hooks/use-project';
import { api } from '~/trpc/react';
import AskQuestion from '../dashboard/ask-question-card';
import MDEditor from '@uiw/react-md-editor';
import CodeRef from '../dashboard/code-references';

const Qapage = () => {
  const { selectedProjectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({projectId : selectedProjectId}
   
  );
  const [questionIndex, setQuestionIndex] = React.useState(0);

  return (
    <Sheet>
      <AskQuestion />
      <div className="h-4"></div>
      <div className="text-xl font-semibold">Saved Questions</div>
      <div className="h-2"></div>
      <div className="flex flex-col gap-2">
        {questions?.map((question, index) => (
          <SheetTrigger key={question.id} asChild>
            <button
              onClick={() => setQuestionIndex(index)}
              className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border w-full text-left"
            >
              <img
                src={question.user.imageUrl ?? ""}
                alt="user image"
                className="rounded-full"
                height={30}
                width={30}
              />
              <div className="text-left flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 line-clamp-1 text-lg font-medium">
                    {question.question}
                  </p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-500 line-clamp-1 text-sm">
                  {question.answer}
                </p>
              </div>
            </button>
          </SheetTrigger>
        ))}
      </div>

      {questions && questions.length > 0 && (
        <SheetContent className="sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle>
              {questions[questionIndex].question}
            </SheetTitle>
            <MDEditor.Markdown source={questions[questionIndex].answer} />
            <CodeRef
              filesReferences={questions[questionIndex].fileReference ?? []}
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default Qapage;
