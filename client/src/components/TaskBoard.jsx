import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../utils/api';

const TaskBoard = ({ tasks, onTaskUpdated }) => {
  const columns = ['To Do', 'In Progress', 'Done'];

  // Handle the drag end event
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a column or in the same place, do nothing
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistic UI Update (Make it look instant before server responds)
    // We assume it worked. In a real app, we would update the local state here too.
    
    // Call Backend to update status
    try {
      await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      onTaskUpdated(); // Refresh data from server to be sure
    } catch (error) {
      console.error("Failed to move task", error);
      alert("Failed to move task");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`rounded-lg p-4 min-h-[500px] transition-colors ${
                  snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-100'
                }`}
              >
                {/* Column Header */}
                <h3 className="text-lg font-bold mb-4 text-gray-700 flex justify-between items-center">
                  {status}
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {tasks.filter((t) => t.status === status).length}
                  </span>
                </h3>

                {/* Task Cards */}
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }} // Essential for smoothness
                            className={`p-4 rounded shadow-sm border-l-4 cursor-grab active:cursor-grabbing ${
                              snapshot.isDragging ? 'bg-blue-100 rotate-2 scale-105 shadow-xl' : 'bg-white'
                            } ${
                              task.priority === 'High' ? 'border-red-500' :
                              task.priority === 'Medium' ? 'border-yellow-500' : 'border-green-500'
                            }`}
                          >
                            <h4 className="font-bold text-gray-800">{task.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            
                            <div className="mt-3 flex justify-between items-center">
                              <span className={`text-xs px-2 py-1 rounded ${
                                task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;