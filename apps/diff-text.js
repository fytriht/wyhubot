const DMP = require("text-diff");
const _ = require("lodash");

module.exports = diffText;

const ChangeKind = {
  DELETION: -1,
  EQUALITY: 0,
  INSERTION: 1,
};

const md = {
  bold(s) {
    return `**${s}**`;
  },
  italic(s) {
    return `_${s}_`;
  },
  strikethrough(s) {
    return `~~${s}~~`;
  },
};

function diffText(t1, t2) {
  const dmp = new DMP();
  const diff = dmp.main(t1, t2);
  dmp.cleanupSemantic(diff);
  return diff
    .map(([change, str]) =>
      str
        .split("\n") // handle new line when adding markdown syntax.
        .map(
          change === ChangeKind.DELETION
            ? _.flow(md.italic, md.strikethrough)
            : change === ChangeKind.INSERTION
              ? md.bold
              : _.identity
        )
        .join("\n")
    )
    .join("");
}
