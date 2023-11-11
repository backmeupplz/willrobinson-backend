# Backend for Will Robinson bot

## Installation and local launch

1. Clone this repo: `git clone https://github.com/backmeupplz/willrobinson-backend`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn` in the root folder
5. Run `yarn start`

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                 | Description                              |
| -------------------- | ---------------------------------------- |
| `MONGO`              | URL of the mongo database                |
| `PORT`               | Port to run server on (defaults to 1337) |
| `FARCASTER_MNEMONIC` | Mnemonic for the the main app            |
| `FID`                | Farcaster ID for the main app            |
| `API_KEY`            | [Neynar](https://neynar.com) API key     |
| `ALCHEMY_KEY`        | [Alchemy](https://alchemy.com) key       |

Also, please, consider looking at `.env.sample`.
