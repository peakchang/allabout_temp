<script>
    export let seoValue;
</script>

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>{seoValue.title}</title>
<meta name="title" content={seoValue.title} />
<meta name="description" content={seoValue.description} />
<link rel="icon" href={seoValue.icon} />
<meta property="og:title" content={seoValue.title} />
<meta property="og:url" content={seoValue.url} />
<meta property="og:type" content="blog" />
<meta property="og:description" content={seoValue.description} />
<meta property="og:image" content={seoValue.image} />
<meta name="date" content={seoValue.date} />
<meta property="article:published_time" content={seoValue.published_time} />
<meta name="naver-site-verification" content="e76e91aceb433f2f606f921a42335f78cfaa0996" />