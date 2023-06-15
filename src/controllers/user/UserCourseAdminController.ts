import { Request, Response } from "express";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { Course } from "../../models/Course";

/**
 * Returns all the user's courses that the requesting user is also a mentor of
 * Courses that the user is not a mentor of will be filtered out
 * @param request
 * @param response
 */
async function getUserCourseMatch(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const userID = request.query.user_id;
    const mentorGroups: MentorGroup[] = await reqUser.getMentorGroupsAndCourses();

    if (userID == null) {
        response.status(404).send({ message: "No User ID supplied" });
        return;
    }

    const user: User | null = await User.findOne({
        where: {
            id: userID.toString(),
        },
        include: [User.associations.courses],
    });

    if (user == null) {
        response.status(404).send({ message: "User with this ID not found" });
        return;
    }

    let courses: Course[] | undefined = user.courses?.filter((course: Course) => {
        for (const mG of mentorGroups) {
            if (mG.courses?.find((c: Course) => c.id == course.id) != null) {
                return true;
            }
        }

        return false;
    });

    if (courses == null) {
        response.status(500).send();
        return;
    }

    response.send(courses);
}

export default {
    getUserCourseMatch,
};
