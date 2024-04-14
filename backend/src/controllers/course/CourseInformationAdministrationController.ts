import { NextFunction, Request, Response } from "express";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { Course } from "../../models/Course";
import { CourseInformation, ICourseInformation, ICourseInformationData, ICourseInformationDurationUnits } from "../../models/CourseInformation";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import { HttpStatusCode } from "axios";

async function getInformation(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { course_uuid: string };
        Validator.validate(params, {
            course_uuid: [ValidationTypeEnum.NON_NULL],
        });

        const course = await Course.findOne({
            where: {
                uuid: params.course_uuid,
            },
            include: [Course.associations.information],
        });

        response.send(course?.information);
    } catch (e) {
        next(e);
    }
}

async function setInformation(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { course_uuid: string };
        const body = request.body as { duration_value?: string; duration_unit?: ICourseInformationDurationUnits; rating?: string; endorsement_id?: string };

        Validator.validate(params, {
            course_uuid: [ValidationTypeEnum.NON_NULL],
        });

        const course_id = await Course.getIDFromUUID(params.course_uuid);
        const endorsementGroup = await EndorsementGroup.findByPk(body.endorsement_id);

        const data: ICourseInformationData = {
            duration: !isNaN(Number(body.duration_value)) && body.duration_value != "" ? Number(body.duration_value) : undefined,
            duration_unit: body.duration_unit as ICourseInformationDurationUnits,
            rating: isNaN(Number(body.rating)) ? undefined : Number(body.rating),
            endorsement_id: endorsementGroup == null ? undefined : endorsementGroup.id,
        };

        const information = await CourseInformation.upsert({
            course_id: course_id,
            data: data,
        });

        response.status(HttpStatusCode.Created).send(information[0]);
    } catch (e) {
        next(e);
    }
}

export default {
    getInformation,
    setInformation,
};
