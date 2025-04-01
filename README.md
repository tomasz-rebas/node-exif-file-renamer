This is a Node.js variant of my [python-exif-file-renamer](https://github.com/tomasz-rebas/python-exif-file-renamer)

# How does it work?

`node-exif-file-renamer` was designed to automate renaming photo files with an information useful for photographers e.g. date, exposure time and aperture. It extracts metadata from image files and uses it to rename them.

New filename follows this pattern:

### `DATE_TIME_FOCALLENGTH_EXPOSURE_APERTURE_ISO`

Example:

`180515_16025102_70mm_1-360s_f7.1_ISO-1600`

The script looks for and renames both JPG and Nikon RAW (.nef) files.
