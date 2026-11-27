"""Build the independent Sphinx courses alongside the main site."""
import argparse
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
COURSES = {"umi": "UMI 机器人示教", "ego": "Ego 第一人称操作学习"}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", nargs="?", type=Path, default=ROOT / "docs/_build/html")
    args = parser.parse_args()
    for slug, title in COURSES.items():
        subprocess.run([
            sys.executable, "-m", "sphinx", "-E", "-a", "-W", "--keep-going", "-n",
            "-c", str(ROOT / "docs"), "-b", "html",
            "-D", "nb_execution_mode=force", "-D", f"project={title}",
            "-D", f"html_title={title}", "-D", f"html_short_title={title}",
            "-D", f"html_baseurl=https://tiansongyu.github.io/robotics-knowledge/{slug}/",
            "-d", str(ROOT / "docs/_build/doctrees" / slug),
            str(ROOT / "tutorials" / slug), str(args.output / slug),
        ], check=True)

    # Use the handbook's own theme and Chinese search implementation.
    slug = "nvidia-cpu-interview"
    subprocess.run([
        sys.executable, "-m", "sphinx", "-E", "-a", "-W", "--keep-going", "-n", "-b", "html",
        "-D", f"templates_path={ROOT / 'docs/_templates'}",
        "-D", f"html_static_path={ROOT / 'docs/_static/custom.css'}",
        "-D", "html_css_files=custom.css",
        "-D", f"html_baseurl=https://tiansongyu.github.io/robotics-knowledge/{slug}/",
        "-A", "catalog_return=../index.html#software",
        "-d", str(ROOT / "docs/_build/doctrees" / slug),
        str(ROOT / slug / "docs"), str(args.output / slug),
    ], check=True)
