import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import TaskItem from "@/components/molecules/TaskItem";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ]);
      
      // Add contact names to tasks
const tasksWithContacts = tasksData.map(task => {
        const contact = contactsData.find(c => c.Id === task.contactId);
        return {
          ...task,
          contactName: contact ? contact.Name : null
        };
      });
      
      setTasks(tasksWithContacts);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleSaveTask = async (formData) => {
    try {
      let savedTask;
      if (selectedTask) {
        savedTask = await taskService.update(selectedTask.Id, formData);
      } else {
        savedTask = await taskService.create(formData);
      }
      
      // Add contact name to the saved task
const contact = contacts.find(c => c.Id === savedTask.contactId);
      savedTask.contactName = contact ? contact.Name : null;
      
      if (selectedTask) {
        setTasks(prev => prev.map(t => t.Id === selectedTask.Id ? savedTask : t));
      } else {
        setTasks(prev => [...prev, savedTask]);
      }
    } catch (error) {
      throw new Error("Failed to save task");
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.Id === taskId);
    if (!task) return;

    try {
      const updatedTask = await taskService.update(taskId, {
        ...task,
        status: task.status === "completed" ? "pending" : "completed"
      });

const contact = contacts.find(c => c.Id === updatedTask.contactId);
      updatedTask.contactName = contact ? contact.Name : null;

      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(`Task marked as ${updatedTask.status}`);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.contactName && task.contactName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === "all" || task.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getTasksByDate = () => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return weekDays.map(day => ({
      date: day,
      tasks: filteredTasks.filter(task => isSameDay(new Date(task.dueDate), day))
    }));
  };

  const getTaskStats = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.status === "completed").length;
    const pending = filteredTasks.filter(t => t.status === "pending").length;
    const overdue = filteredTasks.filter(t => {
      return t.status === "pending" && new Date(t.dueDate) < new Date();
    }).length;

    return { total, completed, pending, overdue };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = getTaskStats();
  const tasksByDate = getTasksByDate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your to-do list and stay organized
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-3 py-1.5"
            >
              <ApperIcon name="List" size={16} className="mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="px-3 py-1.5"
            >
              <ApperIcon name="Calendar" size={16} className="mr-1" />
              Calendar
            </Button>
          </div>
          <Button onClick={handleAddTask} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-surface/50 to-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-2">
            <ApperIcon name="CheckSquare" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-display font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-success/5 to-green-500/5 rounded-xl p-4 border border-success/20">
          <div className="flex items-center space-x-2">
            <ApperIcon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-success">Completed</span>
          </div>
          <p className="text-2xl font-display font-bold text-success mt-1">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-warning/5 to-yellow-500/5 rounded-xl p-4 border border-warning/20">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" size={16} className="text-warning" />
            <span className="text-sm text-warning">Pending</span>
          </div>
          <p className="text-2xl font-display font-bold text-warning mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-error/5 to-red-600/5 rounded-xl p-4 border border-error/20">
          <div className="flex items-center space-x-2">
            <ApperIcon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm text-error">Overdue</span>
          </div>
          <p className="text-2xl font-display font-bold text-error mt-1">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tasks..."
          className="flex-1"
        />
        <div className="flex space-x-2">
          <Button
            variant={filterStatus === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "pending" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === "completed" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Content */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description={searchQuery || filterStatus !== "all" 
            ? "Try adjusting your search or filter criteria." 
            : "Get started by creating your first task."
          }
          actionLabel="Add Task"
          onAction={handleAddTask}
          icon="CheckSquare"
        />
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {filteredTasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map((task) => (
              <TaskItem
                key={task.Id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {tasksByDate.map(({ date, tasks: dayTasks }) => (
            <div key={date.toISOString()} className="bg-gradient-to-br from-surface/50 to-white rounded-xl p-4 border border-gray-100 min-h-[200px]">
              <div className="text-center mb-4">
                <h3 className="font-medium text-gray-900">{format(date, "EEE")}</h3>
                <p className="text-2xl font-display font-bold text-gray-600">{format(date, "d")}</p>
              </div>
              <div className="space-y-2">
                {dayTasks.map((task) => (
                  <div
                    key={task.Id}
                    className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      task.status === "completed"
                        ? "bg-gradient-to-r from-success/10 to-green-500/10 text-success"
                        : "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary hover:from-primary/20 hover:to-secondary/20"
                    }`}
                    onClick={() => handleEditTask(task)}
                  >
                    <p className="font-medium truncate">{task.title}</p>
                    {task.contactName && (
                      <p className="text-gray-500 truncate">{task.contactName}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        task={selectedTask}
        contacts={contacts}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Tasks;