(() => {
  const blogIndex = document.querySelector("[data-blog-index]");
  const filters = Array.from(document.querySelectorAll("[data-blog-filter]"));

  if (!blogIndex || filters.length === 0) {
    return;
  }

  const postElements = Array.from(
    blogIndex.querySelectorAll("[data-post-categories]")
  );
  const yearGroups = Array.from(blogIndex.querySelectorAll("[data-year-group]"));
  const allCategory = "Tudo";

  const categoriesFor = (post) => {
    try {
      const categories = JSON.parse(post.dataset.postCategories || "[]");

      if (!Array.isArray(categories)) {
        return [];
      }

      return categories
        .filter((category) => typeof category === "string")
        .map((category) => category.trim())
        .filter(Boolean);
    } catch (_) {
      return [];
    }
  };

  const posts = postElements.map((post) => ({
    element: post,
    categories: categoriesFor(post),
  }));

  const setActiveFilter = (selectedCategory) => {
    filters.forEach((filter) => {
      const isActive = filter.dataset.blogFilter === selectedCategory;
      filter.classList.toggle("is-active", isActive);

      if (isActive) {
        filter.setAttribute("aria-current", "true");
      } else {
        filter.removeAttribute("aria-current");
      }
    });
  };

  const updateYearVisibility = () => {
    yearGroups.forEach((group) => {
      const hasVisiblePost = Array.from(
        group.querySelectorAll("[data-post-categories]")
      ).some((post) => !post.hidden && !post.classList.contains("is-hidden"));

      group.hidden = !hasVisiblePost;
      group.classList.toggle("is-hidden", !hasVisiblePost);
    });
  };

  const applyFilter = (selectedCategory) => {
    const category = selectedCategory || allCategory;

    posts.forEach((post) => {
      const shouldHide =
        category !== allCategory && !post.categories.includes(category);

      post.element.hidden = shouldHide;
      post.element.classList.toggle("is-hidden", shouldHide);
    });

    setActiveFilter(category);
    updateYearVisibility();
  };

  const categories = new Set(filters.map((filter) => filter.dataset.blogFilter));
  const categoryFromHash = decodeURIComponent(window.location.hash.slice(1));
  const initialCategory = categories.has(categoryFromHash)
    ? categoryFromHash
    : allCategory;

  filters.forEach((filter) => {
    filter.addEventListener("click", (event) => {
      event.preventDefault();

      const selectedCategory = filter.dataset.blogFilter;
      const nextHash =
        selectedCategory === allCategory
          ? window.location.pathname
          : `#${encodeURIComponent(selectedCategory)}`;

      history.replaceState(null, "", nextHash);
      applyFilter(selectedCategory);
    });
  });

  applyFilter(initialCategory);
})();
