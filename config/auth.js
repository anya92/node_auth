module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : "380766268522-04lqhpjv7gp3j7ms0tpigv0027596g5f.apps.googleusercontent.com",
        'clientSecret'  : 'cbz4pX3xjbhay7rLW1c49C3U',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
