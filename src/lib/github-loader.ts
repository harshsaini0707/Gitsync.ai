// utils/githubLoader.ts

import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { Document } from '@langchain/core/documents';
import { generateEmbedding, summariseCode } from './gemini';
import { db } from '~/server/db';

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string
)=> {
  const loader = new GithubRepoLoader(
    githubUrl,
    {
      accessToken: githubToken || '',
      branch: 'main',
      ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
      recursive: true,
      unknown: 'warn',
      maxConcurrency: 5,
    }
  );
  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string
)=> {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      if (!embedding) return;

      console.log(`Processing file: ${embedding.fileName}`);

      try {
        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          projectId,
        },
      });

      // Use Prisma SQL raw query to update the vector column as prisma doesn't support vector
      await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${`[${embedding.embedding.join(',')}]`}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
      `;
      } catch (error) {
        console.error(`Failed to process ${embedding.fileName}:`, error);
      }
    })
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      try {
        const summary = await summariseCode(doc);
        const embedding = await generateEmbedding(summary);

          if (!embedding || embedding.length === 0) {
          console.warn('Empty embedding, skipping:', doc.metadata.source || 'unknown');
          return null;
        }


        return {
          summary,
          embedding,
          sourceCode: doc.pageContent, // no need to stringify/parse
          fileName: doc.metadata.source || 'unknown',
        };
      } catch (error) {
        console.error('Error generating embedding:', error);
        return null;
      }
    })
  );
};
