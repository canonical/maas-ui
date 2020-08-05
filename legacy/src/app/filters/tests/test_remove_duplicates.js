/* Copyright 2015-2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Unit tests for removeDuplicates
 */
import removeDuplicates from "../remove_duplicates";

describe("removeDuplicates", () => {
  it("removes duplicate objects", () => {
    const ips = [
      {
        ip: "172.168.1.1",
        is_boot: false,
      },
      {
        ip: "172.168.1.2",
        is_boot: true,
      },
      {
        ip: "172.168.1.2",
        is_boot: true,
      },
    ];

    expect(removeDuplicates(ips, "ip")).toEqual([
      {
        ip: "172.168.1.1",
        is_boot: false,
      },
      {
        ip: "172.168.1.2",
        is_boot: true,
      },
    ]);
  });
});
