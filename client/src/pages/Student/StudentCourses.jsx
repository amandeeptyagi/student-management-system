import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

const StudentCourses = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchStudentSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students/courses`, {
          withCredentials: true, // ✅ Cookies ke saath request bhejne ke liye
        });

        // Backend ke response se subjects extract kar rahe hain
        if (response.data.length > 0) {
          setSubjects(response.data[0].subjects); // ✅ Pehle course ka subjects array set karna hai
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        alert("Failed to load subjects.");
      }
    };

    fetchStudentSubjects();
  }, []);

  return (
    <div className="p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">My Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
            {subjects.map((subject) => (
              <Card key={subject._id} className="shadow-sm hover:shadow-md transition-shadow w-64">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Instructor: {subject.teacher ? subject.teacher.name : "N/A"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCourses;
