/**
 * Main method to get the ANSI output for a string
 */
export type ReturnObject = {
    /**
     * - The pure string for output with all line breaks
     */
    string: string;
    /**
     * - Each line of output in an array
     */
    array: Array<string>;
    /**
     * - The number of lines
     */
    lines: number;
    /**
     * - All options used
     */
    options: object;
};
/**
 * Main method to get the ANSI output for a string
 *
 * @param  {string}  input       - The string you want to write out
 * @param  {object}  SETTINGS    - Settings object
 * @param  {boolean} debug       - A flag to enable debug mode
 * @param  {number}  debuglevel  - The debug level we want to show
 * @param  {object}  size        - The size of the terminal as an object, default: Size
 * @param  {number}  size.width  - The width of the terminal
 * @param  {number}  size.height - The height of the terminal
 *
 * @typedef  {object} ReturnObject
 *   @property {string}        string  - The pure string for output with all line breaks
 *   @property {Array<string>} array   - Each line of output in an array
 *   @property {number}        lines   - The number of lines
 *   @property {object}        options - All options used
 *
 * @return {ReturnObject|false}        - CLI output of INPUT to be consoled out
 */
export function Render(input: string, SETTINGS?: object, debug?: boolean, debuglevel?: number, size?: {
    width: number;
    height: number;
}): ReturnObject | false;
