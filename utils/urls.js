const dev = process.env.NODE_ENV !== 'production';

module.exports = {
    base: dev ? 'http://localhost:3000' : 'https://meal.mcfarl.in',
    home: '/',
    manage: '/manage',
    auth: {
        sessionLogin: '/api/sessionLogin',
        sessionLogout: '/api/sessionLogout',
        getCurrentUser: '/api/getCurrentUser'
    },
    api: {
        createPerson: '/api/createPerson',
        fetchPeople: '/api/fetchPeople',
        fetchEmails: '/api/fetchEmails',
        fetchPerson: '/api/fetchPerson',
        fetchJobs: '/api/fetchJobs'
    }
};
