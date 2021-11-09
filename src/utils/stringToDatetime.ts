/**
 * yyyy-mm-dd HH:MM:ss 형식을 Date 겍체로 변경
 * @param string 문자열
 * @returns
 */
export default function stringToDatetime(string: string): Date {
    const arr = string.split(" ");
    const date = `${arr[0]}T${arr[1]}.000Z`;
    return new Date(date);
}
