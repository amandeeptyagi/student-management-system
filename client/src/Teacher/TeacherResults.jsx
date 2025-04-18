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
import { Plus, Edit, Trash2 } from 'lucide-react';

const TeacherResults = () => {
  // Initial state with more detailed result structure
  const [results, setResults] = useState([
    { 
      id: 1, 
      course: 'Computer Science',
      subject: 'Programming',
      totalMarks: 85, 
      outOfMarks: 100
    },
    { 
      id: 2, 
      course: 'Mathematics',
      subject: 'Algebra',
      totalMarks: 78, 
      outOfMarks: 100
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState({
    course: '',
    subject: '',
    totalMarks: '',
    outOfMarks: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleAddResult = () => {
    const newResult = {
      id: results.length + 1,
      course: currentResult.course,
      subject: currentResult.subject,
      totalMarks: parseFloat(currentResult.totalMarks),
      outOfMarks: parseFloat(currentResult.outOfMarks)
    };

    setResults([...results, newResult]);
    setCurrentResult({ course: '', subject: '', totalMarks: '', outOfMarks: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditResult = (result) => {
    setCurrentResult(result);
    setIsEditing(true);
    setIsAddDialogOpen(true);
  };

  const handleUpdateResult = () => {
    const updatedResults = results.map(result => 
      result.id === currentResult.id ? currentResult : result
    );

    setResults(updatedResults);
    setIsAddDialogOpen(false);
    setIsEditing(false);
    setCurrentResult({ course: '', subject: '', totalMarks: '', outOfMarks: '' });
  };

  const handleDeleteResult = (id) => {
    setResults(results.filter(result => result.id !== id));
  };

  const calculatePercentage = (totalMarks, outOfMarks) => {
    return ((totalMarks / outOfMarks) * 100).toFixed(2);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Results Management
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="default" 
              onClick={() => {
                setCurrentResult({ course: '', subject: '', totalMarks: '', outOfMarks: '' });
                setIsEditing(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Result
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Result' : 'Add New Result'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course" className="text-right">
                  Course
                </Label>
                <Input
                  id="course"
                  value={currentResult.course}
                  onChange={(e) => setCurrentResult({
                    ...currentResult, 
                    course: e.target.value
                  })}
                  placeholder="Enter Course"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={currentResult.subject}
                  onChange={(e) => setCurrentResult({
                    ...currentResult, 
                    subject: e.target.value
                  })}
                  placeholder="Enter Subject"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalMarks" className="text-right">
                  Total Marks
                </Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={currentResult.totalMarks}
                  onChange={(e) => setCurrentResult({
                    ...currentResult, 
                    totalMarks: e.target.value
                  })}
                  placeholder="Marks Obtained"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="outOfMarks" className="text-right">
                  Out of Marks
                </Label>
                <Input
                  id="outOfMarks"
                  type="number"
                  value={currentResult.outOfMarks}
                  onChange={(e) => setCurrentResult({
                    ...currentResult, 
                    outOfMarks: e.target.value
                  })}
                  placeholder="Total Marks"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={isEditing ? handleUpdateResult : handleAddResult}
              >
                {isEditing ? 'Update' : 'Add'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Total Marks</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.course}</TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.totalMarks} / {item.outOfMarks}</TableCell>
              <TableCell>{calculatePercentage(item.totalMarks, item.outOfMarks)}%</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditResult(item)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteResult(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeacherResults;