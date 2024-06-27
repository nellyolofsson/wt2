/**
 *
 */
export class ChartController {
  /**
   * Renders the chart view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    res.render('netflix/netflix')
  }
}
