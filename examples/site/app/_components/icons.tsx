import { Award, Copy, Database, Mic, Star } from "lucide-react";

/**
 * The one icon barrel, the shape both consumers use: lucide re-exported through a
 * named map, so a page writes `<Icons.Mic />` and a rename lands in one file.
 *
 * It exists here so the demos can stop drawing their own. `foundations` ships no
 * icon set — a design system that picks your icons has picked one more thing than
 * it was asked to — but a demo that inlines a hand-rolled `<svg>` to prove that
 * point spends fifteen lines teaching the reader nothing about the package. Every
 * app that renders these blocks has lucide and a file like this one, so the demos
 * assume it too.
 */
export const Icons = {
  Award,
  Copy,
  Database,
  Mic,
  Star,
};
