# Next.JS Prisma Apollo GraphQL Boilerplate

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You'll need to have the following installed:

- Node.js (v14.18.0, v16.14.0, or >=18.0.0)
- Yarn
- Docker & Docker Compose

### Installing

1. Install the dependencies:
cd secondbrain
`yarn install`

2. Set up the Docker environment:
`docker-compose up`
This will create the PostgreSQL and Redis instances, as defined in docker-compose.yml.

3. Set up the database:
Edit prisma/.env and replace DATABASE_URL with your PostgreSQL connection string.

4. Generate Prisma client:

`yarn prisma generate`

5. Run the migrations:

`yarn prisma migrate dev --name init`

6. Seed the database:

`yarn prisma db seed --preview-feature`

7. Start the development server:

`yarn dev`

8. Open http://localhost:3000 in your browser to see the app.

9. Open http://localhost:3000/api/graphql to see the GraphQL playground.

10. Run prisma studio to see the database:

`yarn prisma studio`

### License

This project is licensed under the MIT License - see the LICENSE.md file for details

### Acknowledgments

- [Prisma](https://www.prisma.io/)
- [Next.js](https://nextjs.org/)
- [GraphQL](https://graphql.org/)
- [Apollo](https://www.apollographql.com/)
- [Google Cloud Platform](https://cloud.google.com/)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- Built with love by [Justin McIntosh]