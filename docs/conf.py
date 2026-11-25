"""Sphinx project documentation configuration."""
import json
from pathlib import Path

project = '机器人知识库'
language = 'zh_CN'
extensions = ['sphinx_rtd_theme', 'myst_nb', 'sphinxcontrib.mermaid', 'sphinx.ext.mathjax']
html_theme_path = ['_themes']
html_theme = 'mabel_handbook'
html_title = project
html_short_title = project
html_theme_options = {
    'navigation_depth': 3,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'style_external_links': True,
}
html_static_path = ['_static']
html_css_files = ['custom.css']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']
html_show_sourcelink = True
html_show_copyright = False
nitpicky = True

# MyST-NB registers MyST Markdown itself; do not also enable myst_parser.
myst_enable_extensions = ['dollarmath', 'colon_fence']
myst_heading_anchors = 3
nb_execution_mode = 'cache'
nb_execution_timeout = 60
nb_execution_raise_on_error = True
nb_execution_allow_errors = False
nb_execution_in_temp = True
mermaid_version = '11.12.2'
mermaid_light_theme = 'base'
mermaid_dark_theme = 'base'
mermaid_init_config = {
    'startOnLoad': False, 'securityLevel': 'strict',
    'themeVariables': {
        'primaryColor': '#f4ead2', 'primaryTextColor': '#192328',
        'primaryBorderColor': '#896d39', 'lineColor': '#46565a',
        'secondaryColor': '#dbe7e6', 'tertiaryColor': '#fffdf6',
        'fontFamily': 'Jost, Microsoft YaHei, sans-serif',
    },
}
html_baseurl = 'https://tiansongyu.github.io/robotics-knowledge/'
mermaid_use_local = 'vendor/mermaid/dist/mermaid.esm.min.mjs'
mathjax_path = 'vendor/mathjax/es5/tex-mml-chtml.js'

# Shared navigation for the handbook and both independent course builds.
templates_path = ['_templates']
DOCS = Path(__file__).resolve().parent
catalog_groups = json.loads((DOCS / 'catalog.json').read_text(encoding='utf-8'))
html_context = {'groups': catalog_groups}
catalog_categories = {
    module['path']: group['id']
    for group in catalog_groups for module in group['modules']
}


def catalog_page(app, pagename, templatename, context, doctree):
    main_site = app.srcdir.resolve() == DOCS
    if main_site and pagename == 'index':
        return 'catalog.html'

    prefix = '' if main_site else app.srcdir.name + '/'
    module_path = f'{prefix}{pagename}.html'
    fallback = 'materials' if main_site else 'software'
    category = catalog_categories.get(module_path, fallback)
    root_index = 'index.html' if main_site else '../index.html'
    context['catalog_return'] = context['pathto'](root_index, 1) + '#' + category


def setup(app):
    app.connect('html-page-context', catalog_page)
