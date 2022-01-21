import CategoryRepository from "./CategoryRepository";
import DocumentRepository from "./DocumentRepository";
import FileTypeRepository from "./FileTypeRepository";
import LocationRepository from "./LocationRepository";
import StudyReportsRepository from "./StudyReportsRepository";
import TimeSeriesRepository from "./TimeSeriesRepository";
import VariablesRepository from "./VariablesRepository";
import AuthRepository from "./AuthRepository";
import PasswordRepository from "./PasswordRepository";
import UserRepository from "./UserRepository";
import AxiosWithoutHeader from "./clients/AxiosWithoutHeader";

export const repository = axios => ({
    'category': CategoryRepository(axios),
    'document': DocumentRepository(axios),
    'fileType': FileTypeRepository(axios),
    'location': LocationRepository(axios),
    'studyReports': StudyReportsRepository(axios),
    'timeSeries': TimeSeriesRepository(axios),
    'variables': VariablesRepository(axios),
    'auth': AuthRepository(axios),
    'password': PasswordRepository(axios),
    'user': UserRepository(AxiosWithoutHeader),
});
