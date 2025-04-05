# Contributing to D&D Currency Tracker

## Git Workflow

1. **Work on the develop branch for all development**:
`git checkout develop`

2. **Create feature branches off develop**:
`git checkout -b feature/feature-name`

3. **Commit your changes with clear messages**:
`git add .`
`git commit -m "Feature: Detailed description of changes"`

4. **Push your feature branch to GitHub**:
`git push -u origin feature:feature-name`

5. **Create a pull request to merge into develop**

6. **After testing on develop, merge to main for production deployment**:

`git checkout main`
`git merge develop`
`git push origin main`
