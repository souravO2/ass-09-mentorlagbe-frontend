import { modes, classLevels, subjects } from "../types/tuition"

export const PAGE_SIZE = 10

type SearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export function parseTuitionQuery(sp: SearchParams) {
  const subject = first(sp.subject) ?? ""
  const classLevel = first(sp.classLevel) ?? ""
  const mode = first(sp.mode)

  return {
    search: (first(sp.search) ?? "").trim().slice(0, 100),
    subject: subjects.includes(subject) ? subject : "",
    classLevel: classLevels.includes(classLevel) ? classLevel : "",
    mode: modes.find((m) => m === mode) ?? "",
    page: Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1),
  }
}

export type TuitionQuery = ReturnType<typeof parseTuitionQuery>
