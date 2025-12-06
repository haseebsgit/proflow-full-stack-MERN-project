import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTeamModal from '../components/CreateTeamModal'; // <--- 1. Import Team Modal
import api from '../utils/api';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false); // <--- 2. New State
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  
  const navigate = useNavigate();

  // Defined outside useEffect so we can call it again after creating a team
  const fetchTeams = async () => {
    try {
      const { data } = await api.get('/teams');
      setTeams(data);
      if (data.length > 0) {
        // If we just created a team and didn't have one before, select it
        if (!activeTeam) setActiveTeam(data[0]);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchProjects = async () => {
    if (!activeTeam) return;
    try {
      const { data } = await api.get(`/projects/team/${activeTeam._id}`);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeTeam]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {activeTeam ? `${activeTeam.name} Dashboard` : 'Dashboard'}
            </h2>
            
            {activeTeam && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                New Project
              </button>
            )}
          </div>

          <div className="mt-8">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div 
                    key={project._id} 
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="overflow-hidden bg-white shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="p-5">
                      <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 truncate">{project.description}</p>
                      <div className="mt-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State Area
              <div className="overflow-hidden bg-white shadow rounded-lg">
                <div className="p-6 text-center py-10">
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {activeTeam ? 'No projects yet' : 'No Team Found'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTeam ? 'Create a project to get started.' : 'You need to be part of a team to see projects.'}
                  </p>
                  
                  {/* 3. Button for New Users to Create a Team */}
                  {!activeTeam && (
                    <div className="mt-6">
                      <button
                        onClick={() => setIsTeamModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Create Your First Team
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Project Modal */}
      {activeTeam && (
        <CreateProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          teamId={activeTeam._id} 
          onProjectCreated={() => {
              setIsModalOpen(false);
              fetchProjects(); 
          }}
        />
      )}

      {/* 4. Team Modal */}
      <CreateTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onTeamCreated={() => {
            fetchTeams(); // Reload teams so the new one appears immediately
        }}
      />
    </div>
  );
};

export default Dashboard;