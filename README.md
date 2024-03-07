# GraphQL

## Objectives

The objective of this project is to learn the GraphQL query language, by creating your own profile page.

You'll use the GraphQL endpoint which is provided by the platform [https://zone01normandie.org/api/graphql-engine/v1/graphql](https://zone01normandie.org/api/graphql-engine/v1/graphql). You'll be able to query your own data to populate your profile page.

So that you can access your data, you'll need to create a login page.

The profile must display three pieces of information which you may choose. For example:

- Basic user identification
- XP amount
- Grades
- Audits
- Skills

Besides those sections, it will have a mandatory section for the generation of statistic graphs.


You'll need a JWT to access the GraphQL API. A JWT can be obtained from the signin endpoint [https://zone01normandie.org/api/auth/signin](https://zone01normandie.org/api/auth/signin).

You may make a POST request to the signin endpoint and supply your credentials using Basic authentication, with base64 encoding.

Your login page must function with both:

- `username:password`
- `email:password`

If the credentials are invalid, an appropriate error message must be displayed.

You must provide a method to log out.

When making GraphQL queries, you'll supply the JWT using Bearer authentication. It will only allow access to the data belonging to the authenticated user.
