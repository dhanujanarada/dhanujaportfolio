#!/usr/bin/env python3
"""Re-export a katana GLB small enough to ship.

Usage:
  blender --background --factory-startup --python scripts/optimize-katana.py -- \
    --input assets/katana/katana.gltf --output public/models/katana.glb

Imports the source, downsamples oversized textures, splits the katana mesh at
the guard so blade and handle can take different materials, and exports WebP +
meshopt. Blender only; no node dependency. Source file stays untouched.
"""

import argparse
import os
import sys

import bpy


def parse_args() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--max-texture", type=int, default=1024)
    parser.add_argument("--quality", type=int, default=85)
    return parser.parse_args(argv)


def split_katana_handle() -> None:
    """Give the handle its own material slot so the blade can stay steel."""
    katana = bpy.data.objects.get("Katana")
    if katana is None or katana.type != "MESH":
        return

    mesh = katana.data
    mesh.materials.append(bpy.data.materials.new("KatanaHandle"))
    handle_index = len(mesh.materials) - 1
    moved = 0

    for polygon in mesh.polygons:
        if polygon.center.x > 0:
            polygon.material_index = handle_index
            moved += 1

    print(f"split handle: {moved} faces -> KatanaHandle")


def main() -> None:
    args = parse_args()

    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=args.input)

    for image in bpy.data.images:
        width, height = image.size
        largest = max(width, height)
        if largest <= args.max_texture:
            continue
        ratio = args.max_texture / largest
        image.scale(max(1, round(width * ratio)), max(1, round(height * ratio)))
        print(f"resized {image.name}: {width}x{height} -> {image.size[0]}x{image.size[1]}")

    split_katana_handle()

    output_dir = os.path.dirname(args.output)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    bpy.ops.export_scene.gltf(
        filepath=args.output,
        export_format="GLB",
        export_image_format="WEBP",
        export_image_quality=args.quality,
        export_meshopt_compression_enable=True,
        export_meshopt_extension="EXT_meshopt_compression",
        use_selection=False,
    )

    size = os.path.getsize(args.output)
    print(f"WROTE {args.output} {size / 1024 / 1024:.2f} MiB")


main()
