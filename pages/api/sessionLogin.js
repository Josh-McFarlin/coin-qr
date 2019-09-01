const admin = require('../../server/firebase');


export default async function (req, res) {
    // Get the ID token passed and the CSRF token.
    const idToken = req.body.idToken.toString();

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    await admin.auth()
        .createSessionCookie(idToken, { expiresIn })
        .then((sessionCookie) => {
            let fullCookie = `session=${sessionCookie}; HttpOnly; Max-Age=${expiresIn}; SameSite=Strict; Path=/`;
            if (process.env.NODE_ENV === 'production') {
                fullCookie += '; Secure';
            }

            res.setHeader('Set-Cookie', [fullCookie]);

            res.status(200).send('success');
        }, () => {
            res.status(401).send('Unauthorized request!');
        })
        .catch(() => {
            res.status(500).send('error');
        });
}
