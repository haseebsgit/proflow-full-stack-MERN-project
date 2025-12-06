import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CreateTaskModal from '../components/CreateTaskModal'; // Import Modal
import TaskBoard from '../components/TaskBoard'; // Import Board
import api from '../utils/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]); // State for tasks
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Modal state

  // Fetch Project Details AND Tasks
  const fetchData = async () => {
    try {
      const projectRes = await api.get(`/projects/${id}`);
      setProject(projectRes.data);

      const tasksRes = await api.get(`/tasks/project/${id}`);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // alert("Failed to load project.");
      // navigate('/'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {project.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{project.description}</p>
          </div>
          <div className="flex mt-4 md:mt-0 md:ml-4">
            <button 
              onClick={() => setIsTaskModalOpen(true)} // Open Modal
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Task Board */}
        <TaskBoard tasks={tasks} onTaskUpdated={fetchData} />

        {/* Create Task Modal */}
        <CreateTaskModal 
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          projectId={id}
          onTaskCreated={fetchData} // Refresh tasks after creating
        />
        
      </div>
    </div>
  );
};

export default ProjectDetails;