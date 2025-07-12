
import { api } from '~/trpc/react';
import { useLocalStorage } from 'usehooks-ts';

const useProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();
  const [selectedProjectId, setProjectId] = useLocalStorage('Gitsync', '');
  const project = projects?.find((project) => project.id === selectedProjectId);

  return {
    projects,
    project,
    selectedProjectId,
    setProjectId,
  };
};

export default useProject;
