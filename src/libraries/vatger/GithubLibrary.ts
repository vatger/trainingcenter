import axios from "axios";
import { TrainingStation } from "../../models/TrainingStation";

type DataHubStations = {
    logon: string;
    frequency: string;
    abbreviation: string;
    description: string;
    gcap_status?: string;
    gcap_training_airport?: boolean;
    s1_twr?: boolean;
};

export async function updateTrainingStations() {
    const res = await axios.get("https://raw.githubusercontent.com/VATGER-Nav/datahub/main/data.json");

    const stations = res.data as DataHubStations[];

    for (const station of stations) {
        if (station.logon.length === 0 || station.frequency.length === 0) continue;

        const gcap_class_str = station.gcap_status ?? "0";
        const gcap_class_nr = gcap_class_str === "0" || gcap_class_str === "1" ? parseInt(gcap_class_str, 10) : 2;

        const stationData = {
            callsign: station.logon,
            frequency: Number(station.frequency),
            gcap_class: gcap_class_nr,
            gcap_class_group: gcap_class_str,
            gcap_training_airport: station.gcap_training_airport ?? false,
            s1_twr: station.s1_twr ?? false,
        };

        const dbStation = await TrainingStation.findOne({ where: { callsign: station.logon } });
        if (dbStation == null) {
            await TrainingStation.create(stationData);
            continue;
        }

        await dbStation.update(stationData);
    }
}
