# Trainingcenter

The trainingcenter project contains the code for the VATSIM Germany ATC Training Center. 

Built using React & Express.js, this project focuses on providing an interactive user interface for both trainees and mentors alike. 

## Contact

|         Name         | Responsible for |     Contact     |
|:--------------------:|:---------------:|:---------------:|
| Nikolas G. - 1373921 |        *        | `git@vatger.de` |

## Prerequisites
- **Node.js** (https://nodejs.org/en) - (`>= 9.8.1`, other versions may work, but are not guaranteed)
- **SQL Server** (e.g. https://mariadb.org/)

## Running the Application

Firstly, you will need to install the required packages by running `npm install` (we will likely switch to bun or pnpm in the future though...). 

You will also need to have an SQL Database (MariaDB for example) setup and running. Configure the `.env` file located within the `./backend` directory to reflect your local environment. 
You can use the `.env.example` file located in the same directory as a starting point. 

### First Run
During the first run, you will likely want to both migrate and seed the database. For this, use the following commands (whilst in the root directory):
1. `npm run seq db:migrate`
2. `npm run seq db:seed:all` (optionally for only a specific seeder: `npm run seq db:seed -- --seed ./path/to/seeder.js`)

### Starting the Frontend & Backend

1. To run the Frontend: Run `npm run frontend:dev`
2. To run the Backend:  Run `npm run backend:dev`

## Note to Webstorm users
Due to Webstorm's opinion-ness, throwing within a try block - and hence catching the exception locally is discouraged. 
We believe that this flow makes the code more consistent and therefore more readable. This is as usual, however, a personal opinion. 

To disable this behaviour, head to: `Settings | Editor | Inspections` and turn off: `JavaScript and TypeScript > Try statement issues > Exception used for local control-flow`. 