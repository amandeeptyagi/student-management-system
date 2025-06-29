import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([
    { 
      id: 1, 
      title: 'Math Problem Set', 
      subject: 'Algebra II',
      class: '10th Grade',
      dueDate: '2024-04-15', 
      status: 'Pending',
      file: null,
      fileName: 'math_problems.pdf'
    },
    { 
      id: 2, 
      title: 'Physics Lab Report', 
      subject: 'Advanced Physics',
      class: '11th Grade',
      dueDate: '2024-04-20', 
      status: 'Graded',
      file: null,
      fileName: 'physics_lab_template.docx'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    class: '',
    dueDate: '',
    file: null,
    fileName: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAssignment({
        ...newAssignment,
        file: file,
        fileName: file.name
      });
    }
  };

  const handleAddAssignment = () => {
    const assignment = {
      ...newAssignment,
      id: assignments.length + 1,
      status: 'Pending'
    };
    setAssignments([...assignments, assignment]);
    setIsAddDialogOpen(false);
    // Reset form
    setNewAssignment({
      title: '',
      subject: '',
      class: '',
      dueDate: '',
      file: null,
      fileName: ''
    });
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const handleDownload = (fileName) => {
    // In a real application, this would trigger a download of the actual file
    // For this example, we're just simulating the download action
    alert(`Downloading ${fileName}`);
    
    // In a real implementation, you would do something like:
    // const url = URL.createObjectURL(file);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = fileName;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Assignment Management
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              Create New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">
                  Title
                </label>
                <Input 
                  id="title" 
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({
                    ...newAssignment, 
                    title: e.target.value
                  })}
                  className="col-span-3" 
                  placeholder="Enter assignment title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="subject" className="text-right">
                  Subject
                </label>
                <Input 
                  id="subject"
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({
                    ...newAssignment, 
                    subject: e.target.value
                  })}
                  className="col-span-3"
                  placeholder="Enter subject name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="class" className="text-right">
                  Class
                </label>
                <Input 
                  id="class"
                  value={newAssignment.class}
                  onChange={(e) => setNewAssignment({
                    ...newAssignment, 
                    class: e.target.value
                  })}
                  className="col-span-3"
                  placeholder="Enter class level"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dueDate" className="text-right">
                  Due Date
                </label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({
                    ...newAssignment, 
                    dueDate: e.target.value
                  })}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="file" className="text-right">
                  Upload File
                </label>
                <div className="col-span-3">
                  <Input 
                    id="file" 
                    type="file"
                    onChange={handleFileChange}
                    className="col-span-3" 
                  />
                  {newAssignment.fileName && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {newAssignment.fileName}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddAssignment}
                disabled={!newAssignment.title || !newAssignment.subject || !newAssignment.class}
              >
                Create Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.id}</TableCell>
              <TableCell>{assignment.title}</TableCell>
              <TableCell>{assignment.subject}</TableCell>
              <TableCell>{assignment.class}</TableCell>
              <TableCell>{assignment.dueDate}</TableCell>
              <TableCell>
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${assignment.status === 'Pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                  }
                `}>
                  {assignment.status}
                </span>
              </TableCell>
              <TableCell>
                {assignment.fileName ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownload(assignment.fileName)}
                  >
                    Download
                  </Button>
                ) : (
                  <span className="text-gray-400">No file</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{assignment.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <p><strong>Subject:</strong> {assignment.subject}</p>
                        <p><strong>Class:</strong> {assignment.class}</p>
                        <p><strong>Due Date:</strong> {assignment.dueDate}</p>
                        <p><strong>Status:</strong> {assignment.status}</p>
                        {assignment.fileName && (
                          <div>
                            <p><strong>File:</strong> {assignment.fileName}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mt-2"
                              onClick={() => handleDownload(assignment.fileName)}
                            >
                              Download File
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeacherAssignments;