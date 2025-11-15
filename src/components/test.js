if (Array.isArray(projects[projectIndex].borings[boringIndex].samples)) {
    projects[projectIndex].borings[boringIndex].samples.push(newSample);
} else {
    boring.samples = [newSample];
}