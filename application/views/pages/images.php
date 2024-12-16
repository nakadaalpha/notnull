<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    body {
        margin: 0;
        padding: 0;
    }

    .wrapper {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }

    .parent {
        width: 100%;
        margin: 20px;
        height: 400px;
        overflow: hidden;
        position: relative;
        display: inline-block;
        border-radius: 10px;
    }

    .child {
        height: 100%;
        width: 100%;
        background-size: cover;
        transition: all .5s;
    }

    .parent:hover .child {
        transform: scale(1.1);
    }

</style>
<body>
    <div class="wrapper">
        <div class="parent">
            <div class="child">
                <img src="public/src/images/1.png">
            </div>
        </div>
    </div>
</body>
</html>