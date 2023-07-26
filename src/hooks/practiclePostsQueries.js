export const getPatternsQuery = async () => {
    const PatternResponse = await fetch(`http://localhost:5000/api/posts/fetchPattern`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return PatternResponse.json();
};

export const getClassQuery = async (patternId) => {
    const ClassResponse = await fetch(`http://localhost:5000/api/posts/fetchClass/${patternId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return ClassResponse.json();
};

export const getSemesterQuery = async (classId) => {
    const SemesterResponse = await fetch(`http://localhost:5000/api/posts/fetchSmesters/${classId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return SemesterResponse.json();
};

export const getSubjectsQuery = async (semesterId) => {
    console.log(semesterId);
    const SubjectResponse = await fetch(`http://localhost:5000/api/posts/fetchSubjects/${semesterId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return SubjectResponse.json();
};

export const getPracticlesQuery = async (subjectId) => {
    const SubjectResponse = await fetch(`http://localhost:5000/api/posts/fetchPracticles/${subjectId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return SubjectResponse.json();
};