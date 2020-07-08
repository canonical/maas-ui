import { array } from "cooky-cutter";
import type { Factory } from "cooky-cutter";

/**
 * A wee utility which means we don't have to directly import
 * from cooky-cutter in our tests when generating arrays of factory objects.
 *
 * @param factory - cooky-cutter factory
 * @param num - number of factory objects to generate
 */
export const buildArray = <T>(factory: Factory<T>, num: number): T[] =>
  array(factory, num)();
