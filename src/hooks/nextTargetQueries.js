const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000/";

export const getPatternsQuery = async () => {
    const PatternResponse = await fetch(`${baseUrl}api/posts/fetchPattern`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return PatternResponse.json();
};

export const getCourseQuery = async (patternId) => {
    const ClassResponse = await fetch(`${baseUrl}api/posts/fetchClass/${patternId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return ClassResponse.json();
};

export const getSemesterQuery = async (classId) => {
    const SemesterResponse = await fetch(`${baseUrl}api/posts/fetchSmesters/${classId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return SemesterResponse.json();
};

export const getSubjectsQuery = async (semesterId) => {
    const SubjectResponse = await fetch(`${baseUrl}api/posts/fetchSubjects/${semesterId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return SubjectResponse.json();
};

export const getPracticlesQuery = async (subjectId) => {
    const SubjectResponse = await fetch(`${baseUrl}api/posts/fetchPracticles/${subjectId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return SubjectResponse.json();
};

export const getPracticleQuery = async (practicleId) => {
    const PracticleResponse = await fetch(`${baseUrl}api/posts/fetchPost/${practicleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
    });
    return PracticleResponse.json();
};