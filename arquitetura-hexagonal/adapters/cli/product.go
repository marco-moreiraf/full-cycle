package cli

import (
	"fmt"

	"github.com/marco-moreiraf/arquitetura-hexagonal/application"
)

func Run(service application.ProductServiceInterface, action, productId, productName string, price float64) (string, error) {
	var result = ""

	switch action {
	case "create":
		product, err := service.Create(productName, price)
		if err != nil {
			return result, err
		}

		result = fmt.Sprintf("Product ID %s with the name %s has been created with the price %.2f ad status %s",
			product.GetID(),
			product.GetName(),
			product.GetPrice(),
			product.GetStatus(),
		)

	case "enable":
		product, err := service.Get(productId)
		if err != nil {
			return result, err
		}

		res, err := service.Enable(product)
		if err != nil {
			return result, err
		}

		result = fmt.Sprintf("Product %s has been enabled.", res.GetName())

	case "disable":
		product, err := service.Get(productId)
		if err != nil {
			return result, err
		}

		res, err := service.Disable(product)
		if err != nil {
			return result, err
		}

		result = fmt.Sprintf("Product %s has been disabled.", res.GetName())

	default:
		product, err := service.Get(productId)
		if err != nil {
			return result, err
		}

		result = fmt.Sprintf("ProductID: %s\nName: %s\nPrice: %.2f\nStatus: %s",
			product.GetID(),
			product.GetName(),
			product.GetPrice(),
			product.GetStatus(),
		)
	}

	return result, nil
}
