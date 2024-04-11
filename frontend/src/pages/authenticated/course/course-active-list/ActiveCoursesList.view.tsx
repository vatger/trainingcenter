import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Input } from "@/components/ui/Input/Input";
import { CCourseSkeleton } from "../_skeletons/CCourse.skeleton";
import React, { useState } from "react";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TbFilter } from "react-icons/tb";
import { MapArray } from "@/components/conditionals/MapArray";
import { CourseModel } from "@/models/CourseModel";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { Alert } from "@/components/ui/Alert/Alert";
import { COLOR_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { CALContainerPartial } from "./_partials/CALContainer.partial";
import { useFilter } from "@/utils/hooks/useFilter";
import { fuzzySearch } from "@/utils/helper/fuzzysearch/FuzzySearchHelper";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Separator } from "@/components/ui/Separator/Separator";
import { Link } from "react-router-dom";
import useApi from "@/utils/hooks/useApi";

const filterFunction = (course: CourseModel, searchValue: string) => {
    return fuzzySearch(searchValue, [course.name]).length > 0;
};

export function ActiveCoursesListView() {
    const [searchInput, setSearchInput] = useState<string>("");
    const debouncedInput = useDebounce(searchInput, 250);

    const { data: courses, loading } = useApi<CourseModel[]>({
        url: "/course/active",
        method: "get",
    });
    const filteredCourses = useFilter<CourseModel>(courses ?? [], searchInput, debouncedInput, filterFunction);

    return (
        <>
            <PageHeader title={"Aktive Kurse"} hideBackLink />

            <RenderIf
                truthValue={loading || (courses != null && courses?.length > 0)}
                elementTrue={
                    <RenderIf
                        truthValue={!loading && courses != null && courses.length > 0}
                        elementTrue={
                            <>
                                <Card>
                                    <div className={"flex w-full lg:flex-row flex-col justify-between"}>
                                        <Input
                                            value={searchInput}
                                            onChange={e => setSearchInput(e.target.value)}
                                            className={"mb-2 w-full"}
                                            label={"Kurse Filtern"}
                                            placeholder={(courses?.length ?? 0) > 0 ? courses?.[0].name : "Frankfurt Tower Einweisung"}
                                        />

                                        <Button
                                            className={"lg:ml-2 mb-2 mt-auto h-[39px]"}
                                            variant={"twoTone"}
                                            icon={<TbFilter size={20} />}
                                            color={COLOR_OPTS.PRIMARY}>
                                            Filter Hinzufügen (TODO)
                                        </Button>
                                    </div>

                                    <p className={"mt-3"}>Die Suche ergab {filteredCourses.length} Treffer</p>
                                </Card>

                                <Separator className={"mt-6 mb-1"} />

                                <MapArray
                                    data={filteredCourses}
                                    mapFunction={(course: CourseModel, index) => {
                                        return <CALContainerPartial key={index} course={course} />;
                                    }}
                                />
                            </>
                        }
                        elementFalse={
                            <MapArray
                                data={Array(3).fill(0)}
                                mapFunction={(v, i) => {
                                    return <CCourseSkeleton key={i} />;
                                }}
                            />
                        }
                    />
                }
                elementFalse={
                    <Alert rounded showIcon type={TYPE_OPTS.DANGER}>
                        <>
                            Du bist aktuell in keinem Kurs eingeschrieben. Klicke{" "}
                            <Link className={"hover:underline"} to={"/course"}>
                                hier
                            </Link>{" "}
                            um eine Übersicht der zur Verfügung stehenden Kurse zu bekommen.{" "}
                        </>
                    </Alert>
                }
            />
        </>
    );
}
