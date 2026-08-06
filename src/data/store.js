let nextId = 1;

const students = [];

function createStudent({ name, email, age }) {
  const student = {
    id: nextId++,
    name,
    email,
    age,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  students.push(student);
  return student;
}

function getAllStudents() {
  return [...students];
}

function getStudentById(id) {
  return students.find((student) => student.id === id) ?? null;
}

function updateStudent(id, updates) {
  const index = students.findIndex((student) => student.id === id);
  if (index === -1) {
    return null;
  }

  const current = students[index];
  const updated = {
    ...current,
    ...updates,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  students[index] = updated;
  return updated;
}

function deleteStudent(id) {
  const index = students.findIndex((student) => student.id === id);
  if (index === -1) {
    return false;
  }

  students.splice(index, 1);
  return true;
}

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
