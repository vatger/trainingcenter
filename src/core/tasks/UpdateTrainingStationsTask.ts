import { updateTrainingStations } from "../../libraries/vatger/GithubLibrary";

async function handle() {
    console.log("Handle...");
    try {
        await updateTrainingStations();
    } catch (e) {}
}

export default {
    handle,
};
