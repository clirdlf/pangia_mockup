---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
<div class="container">
    <h1>Datasets</h1>

    {%- assign counter = 1 -%}
    {% for record in site.records %}
        <p><a href="{{ record.url | relative_url }}">{{ record.title }}</a></p>
        {% assign counter = counter | plus:1 %}
    {% endfor %}

</div>
